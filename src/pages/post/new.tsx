import { Box, Text } from "@chakra-ui/core";
import { NextPage } from "next";
import * as React from "react";
import { LayoutAuthenticated } from "../../components/layout-authenticated";
import { useCreatePostMutation, PostConnection } from "../../generated/graphql";
import { CameraModule } from "../../components/camera";
import { Router } from "next/router";

export interface CameraStateType {
  cameraStatus: "cameraIsOpen" | "cameraIsClosed";
  cardImage: Blob | null;
}

export type CameraAction =
  | { type: "openCameraInit" }
  | { type: "closeCamera" }
  | { type: "clearCardImage" }
  | { type: "setCardImage"; payload: Blob };

const initialCameraState: CameraStateType = {
  cameraStatus: "cameraIsClosed",
  cardImage: null
};

function initCamera(theInitialCameraState: CameraStateType): CameraStateType {
  return {
    cameraStatus: theInitialCameraState.cameraStatus,
    cardImage: theInitialCameraState.cardImage
  };
}

function cameraReducer(
  state: CameraStateType,
  action: CameraAction
): CameraStateType {
  switch (action.type) {
    case "openCameraInit":
      return {
        cameraStatus: "cameraIsOpen",
        cardImage: null
      };

    case "closeCamera":
      return {
        cameraStatus: "cameraIsClosed",
        cardImage: null
      };

    case "clearCardImage":
      return {
        cameraStatus: state.cameraStatus,
        cardImage: null
      };

    case "setCardImage":
      return {
        cameraStatus: state.cameraStatus,
        cardImage: action.payload
      };

    default:
      return initialCameraState;
  }
}

type NewProps = {
  router: Router;
};

const New: NextPage<NewProps> = ({ router }) => {
  // const [isCameraOpen, setIsCameraOpen] = React.useState(initialCameraState);
  // const [cardImage, setCardImage] = React.useState<Blob>();
  // const [postCreated, setPostCreated] = React.useState(initialPostCreatedState);

  const [cameraState, cameraDispatch] = React.useReducer(
    cameraReducer,
    initialCameraState,
    initCamera
  );

  const [createPost, { error: errorCreatePost }] = useCreatePostMutation({
    update(cache, { data: postMutationData }) {
      // if there's no data don't screw around with the cache
      if (!postMutationData) return;

      cache.modify({
        fields: {
          getGlobalPostsRelay(existingPosts): PostConnection {
            const { edges, __typename, pageInfo } = existingPosts;

            return {
              edges: [
                {
                  __typename: "PostEdge",
                  cursor: new Date().toISOString(),
                  node: {
                    comments_count: 0,
                    likes_count: 0,
                    currently_liked: false,
                    likes: [],
                    created_at: new Date().toISOString(),
                    __typename: postMutationData?.createPost.__typename,
                    images: postMutationData?.createPost.images,
                    text: postMutationData?.createPost.text,
                    title: postMutationData?.createPost.title,
                    id: postMutationData?.createPost.id
                  }
                },
                ...edges
              ],
              __typename,
              pageInfo
            };
          }
        }
      });
    }
  });
  return (
    <LayoutAuthenticated>
      <Box>
        <Text fontSize="3xl">Create Post</Text>
        <CameraModule
          cameraState={cameraState}
          cameraDispatch={cameraDispatch}
        />
      </Box>
    </LayoutAuthenticated>
  );
};

export default New;
