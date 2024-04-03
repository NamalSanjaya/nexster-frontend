import { useState, useEffect, useMemo } from "react";
import { List, ListItem, Typography, Card } from "@mui/material";
import { useNavigate } from "react-router-dom";

import TimelinePost from "./media/post";
import { UnAuthorizedError, LoginPath, GetAnyTypePostForTimeline } from "../apis/fetch";
import Base1 from "./layout/base1";
import { TimeDiffWithNow } from "../helper/date";
import { CleanLS, GetUserInfoFromLS, GetPageNoFromLS, SetPageNoInLS} from "../apis/store";
import VideoPost from "./media/videoPost";

/**
 * gap between two post - 700
 * fetch n posts. (n-odd)
 * Gap between two fetch = (n//2)*700
 * 
 */
const pageSize = 5

const calGap = (noOfPosts) => {
  if(noOfPosts === 1) return 700
  return Math.floor(noOfPosts / 2) * 700;
}

let initGap = calGap(pageSize); // To fetch 5 posts. gap should be (5//2)*700
let limit = initGap;

const youtubeBaseUrl = "https://www.youtube.com/watch?v="

function ListTimelinePosts({ userId, initPageNo }) {
  const navigate = useNavigate();
  const [postsInfo, addPostsInfo] = useState({ preLn: 0, data: [] });
  const [noData, setNoData] = useState(false);
  const [pageNo, setPageNo] = useState(initPageNo)
  const [gap, setGap] = useState(initGap)

  useEffect(() => {
    window.scrollTo(0, 0);

    (async () => {
      if (pageNo <= 0) return;
      try {
        let resp = await GetAnyTypePostForTimeline(pageNo, pageSize);
        if (resp.nextPage === -1) {
          setNoData(true);
          setPageNo(-1)
          SetPageNoInLS(1)
          return;
        }
        setGap(calGap(resp.count))
        addPostsInfo({ preLn: resp.count, data: resp.data });
        setPageNo(preVal => {
          SetPageNoInLS(resp.nextPage)
          return resp.nextPage
        })
      } catch (err) {
        if (err instanceof UnAuthorizedError) {
          navigate("/login", { replace: true });
          return;
        }
      }
    })();
  }, []);

  useEffect(() => {
    if (pageNo <= 0) return;

    const handleScroll = async () => {
      
      if (window.scrollY > limit) {
        limit += gap;
        if (postsInfo.preLn === 0 || pageNo === -1) {
          // All posts have been read
          return;
        }
        try {
          let resp2 = await GetAnyTypePostForTimeline(pageNo, pageSize)
          if (resp2.count !== 0 || resp2.nextPage !== -1) {
            addPostsInfo((prevPosts) => {
              return {
                preLn: resp2.count,
                data: prevPosts.data.concat(resp2.data),
              };
            });
            setGap( calGap(resp2.count) )
            setPageNo( prevPg => {
              SetPageNoInLS(resp2.nextPage)
              return resp2.nextPage;
            })
            return
          } 
          setPageNo(-1)
          SetPageNoInLS(1)
        } catch (err) {
          if (err instanceof UnAuthorizedError) {
            navigate("/login", { replace: true });
            return;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    // do the cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [postsInfo]);

  if (noData)
    return (
      <Card
        sx={{
          width: "870px",
          height: "100px",
          borderRadius: "10px",
          paddingLeft: "25px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "20px",
        }}
        spacing={1}
      >
        <Typography> Make some friends and start seeing new posts </Typography>
      </Card>
    );
  return (
    <div>
      <List>
        {postsInfo.data.map((each, index) => {
          let comp = null
          let listKey = ""
          if(each?.type === "video") {
            listKey = `${index}#${each.vId}`
            comp = <VideoPost postInfo={{
                url: youtubeBaseUrl + each.vId,
                title: each.title,
                postDate: TimeDiffWithNow(each.pubAt),
              }}/>
          } else if(each?.type === "image") {
            listKey = `${index}#${each.media._key}`
            comp = <TimelinePost
                postInfo={{
                  imgUrl: each.media.link,
                  caption: each.media.title,
                  description: each.media.description,
                  mediaKey: each.media._key,
                }}
                profInfo={{
                  name: each.owner.name,
                  postDate: TimeDiffWithNow(each.media.created_date),
                  profUrl: each.owner.image_url,
                }}
                reactsCnt={
                  each.reactions.like +
                  each.reactions.love +
                  each.reactions.laugh
                }
                viewerId={userId}
                viewerReaction={each.viewer_reaction}
                indexNo={each.owner.indexNo}
              />
          }
          return (
            <ListItem
              sx={{ marginY: "5px" }}
              key={listKey}
            >
              {comp}
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}

export default function Timeline() {
  const navigate = useNavigate();
  const { userid } = useMemo(GetUserInfoFromLS, []);
  const initPageNo =  useMemo(GetPageNoFromLS, [])

  if (userid === undefined) {
    CleanLS();
    navigate(LoginPath, { replace: true });
  }
  return (
    <Base1
      styles={{ alignItems: "center" }}
      SideComponent={<ListTimelinePosts userId={userid} initPageNo={initPageNo}/>}
    />
  );
}
