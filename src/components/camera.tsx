import * as React from "react";
import { Flex, Button } from "@chakra-ui/core";

import Camera from "./old-camera";
import FauxCamera from "./faux-camera";
import { CameraAction, CameraStateType } from "../pages/post/new";

interface CameraModuleProps {
  cameraDispatch: React.Dispatch<CameraAction>;
  cameraState: CameraStateType;
  // cardImage: Blob | undefined;
  // setCardImage: React.Dispatch<React.SetStateAction<Blob | undefined>>;
  // isCameraOpen: boolean;
  // setIsCameraOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // postCreated: boolean;
  // setPostCreated: React.Dispatch<React.SetStateAction<boolean>>;

  // createPost: CreatePostMutationFn;
  // dataCreatePost: CreatePostMutationResult["data"];
  // errorCreatePost: CreatePostMutationResult["error"];
  // loadingCreatePost: CreatePostMutationResult["loading"];
  // onCapture?: any | undefined;
  // onClear?: any | undefined;
}

export const CameraModule: React.FunctionComponent<CameraModuleProps> = ({
  cameraDispatch,
  cameraState
}) => {
  return (
    <React.Fragment>
      <Flex
        display="flex"
        flexDirection="column"
        height="100%"
        flex="1 1 auto"
        alignItems="center"
        textAlign="center"
        overflowX="hidden"
      >
        <Flex>
          <Button
            type="button"
            colorScheme={
              cameraState.cameraStatus === "cameraIsOpen" ? "teal" : "blue"
            }
            onClick={() => {
              cameraDispatch({
                type:
                  cameraState.cameraStatus === "cameraIsClosed"
                    ? "openCameraInit"
                    : "closeCamera"
              });

              if (cameraState.cameraStatus === "cameraIsOpen") {
                cameraDispatch({
                  type: "clearCardImage"
                });
              }
            }}
          >
            {cameraState.cameraStatus === "cameraIsOpen"
              ? "close camera"
              : "open camera"}
          </Button>
        </Flex>
        {cameraState.cameraStatus}
        <Flex height="100%" w="100%">
          {cameraState.cameraStatus === "cameraIsOpen" ? (
            <Camera cameraDispatch={cameraDispatch} cameraState={cameraState} />
          ) : (
            <FauxCamera
              cameraDispatch={cameraDispatch}
              cameraState={cameraState}
            />
          )}
        </Flex>
      </Flex>
    </React.Fragment>
  );
};
