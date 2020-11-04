// imported from:
// https://www.smashingmagazine.com/2020/03/infinite-scroll-lazy-image-loading-react/
// https://github.com/chidimo/React-Infinite-Scroll-and-Lazy-Loading/blob/master/src/customHooks.js
import * as React from "react";
import {
  GlobalPostReturnType,
  Image,
  Like,
  Maybe,
  PostEdge,
  User
} from "../generated/graphql";

export function useInfiniteScroll(
  scrollRef: React.MutableRefObject<HTMLDivElement | null>,
  setInfState: React.Dispatch<React.SetStateAction<"idle" | "fetch-more">>
) {
  const scrollObserver = React.useCallback(
    (node) => {
      new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.intersectionRatio > 0) {
            setInfState("fetch-more");
            // dispatch({ type: "ADVANCE_PAGE" });
          }
        });
      }).observe(node);
    },
    [setInfState]
  );
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollObserver(scrollRef.current);
    }
  }, [scrollObserver, scrollRef]);
}

type ConvenienceEdge =
  | Array<
      { __typename?: "PostEdge" } & Pick<PostEdge, "cursor"> & {
          node: { __typename?: "GlobalPostReturnType" } & Pick<
            GlobalPostReturnType,
            | "id"
            | "title"
            | "text"
            | "likes_count"
            | "comments_count"
            | "currently_liked"
            | "created_at"
          > & {
              user?: Maybe<
                { __typename?: "User" } & Pick<
                  User,
                  "id" | "username" | "profileImgUrl"
                >
              >;
              images?: Maybe<
                Array<{ __typename?: "Image" } & Pick<Image, "id" | "uri">>
              >;
              likes?: Maybe<Array<{ __typename?: "Like" } & Pick<Like, "id">>>;
            };
        }
    >
  | undefined;

// lazy load images with intersection observer
export const useLazyLoading = (imgSelector: string, items: ConvenienceEdge) => {
  const imgObserver = React.useCallback((node: HTMLImageElement) => {
    const intObs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.intersectionRatio > 0) {
          const currentImg = en.target as HTMLImageElement;

          const newImgSrc = currentImg.dataset.srcset;

          // only swap out the image source if the new url exists
          if (!newImgSrc) {
            console.error("Image source is invalid");
          } else {
            currentImg.srcset = newImgSrc;
          }
          intObs.unobserve(node);
        }
      });
    });
    intObs.observe(node);
  }, []);

  const imagesRef = React.useRef<NodeListOf<HTMLImageElement> | null>(null);

  React.useEffect(() => {
    imagesRef.current = document.querySelectorAll(imgSelector);

    if (imagesRef.current) {
      imagesRef.current.forEach((img) => imgObserver(img));
    }
  }, [imgObserver, imagesRef, imgSelector, items]);
};
