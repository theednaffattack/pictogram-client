import {
  Avatar,
  Box,
  Button,
  Flex,
  Link as ChLink,
  Text
} from "@chakra-ui/core";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../lib/utilities.is-server";

export function Navbar() {
  const [
    { data: logoutData, fetching: logoutFetching },
    logout
  ] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    // Do not run this query on the server.
    pause: isServer()
  });
  const router = useRouter();
  // user is not logged in
  let body = (
    <>
      <Link href="/login" passHref>
        <ChLink mr={2}>login</ChLink>
      </Link>
      <Link href="/register" passHref>
        <ChLink mr={2}>register</ChLink>
      </Link>
    </>
  );
  if (fetching) {
    // fetching
  } else if (data?.me) {
    // logged in
    body = (
      <>
        <Link href="/profile" passHref>
          <ChLink mr={2}>
            <Avatar size="md" name={data?.me?.username} />
          </ChLink>
        </Link>
        <Button
          bg="transparent"
          border="1px solid gray"
          isLoading={logoutFetching}
          onClick={() => {
            logout();

            // router.push("/login");
          }}
        >
          logout
        </Button>
      </>
    );
  }
  return (
    <Flex bg="papayawhip" p={4}>
      <Box ml="auto">{body}</Box>
    </Flex>
  );
}