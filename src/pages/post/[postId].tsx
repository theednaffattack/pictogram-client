import { NextPage } from "next";
import { Router } from "next/router";
import React from "react";
import { MeDocument, MeQuery } from "../../generated/graphql";
import { initializeApollo } from "../../lib/config.apollo-client";
import { MyContext } from "../../lib/types";
// import { ParsedUrlQuery } from "querystring";

// import { Header } from "../../src/components/Header";
// import { HelloWorldComponent } from "../../src/components/generated/apollo-graphql";
// import { getLayout } from "../../src/modules/site-layout/layout";
// import { IExtendedPageProps } from "../../src/page-types/types";
// import { MyContext } from "types/types";

// interface IPostById {
//   ({ pathname, id, query }: IExtendedPageProps): JSX.Element;

//   getInitialProps: ({
//     pathname,
//     query
//   }: MyContext) => Promise<{
//     pathname: string;
//     query: ParsedUrlQuery;
//   }>;

//   getLayout: (page: any) => JSX.Element;

//   title: string;
// }

type PostByIdProps = {
  router?: Router;
  me: MeQuery;
}

const PostById: NextPage<PostByIdProps> = ({ router }) => {
  return (
    
        <>
        
          <h1>Post: {JSON.stringify({ id: router?.query.id as string })}</h1>
          <h1>Post: {JSON.stringify({ pathname: router?.pathname })}</h1>
          <h1>Post: {JSON.stringify({ query: router?.query })}</h1>
        </>
  );
};

PostById.getInitialProps = async (ctx: MyContext) => {
  if (!ctx.apolloClient) ctx.apolloClient = initializeApollo();

  

  let meResponse;
  try {
    meResponse = await ctx.apolloClient.mutate({
      mutation: MeDocument
    });
  } catch (error) {
    console.warn("ME ERROR - POST ROUTE", error);
  }

  return {
    me: meResponse?.data ? meResponse?.data : {},
  };
};

export default PostById;
