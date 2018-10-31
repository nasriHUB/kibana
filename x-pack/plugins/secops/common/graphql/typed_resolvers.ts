/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { GraphQLResolveInfo } from 'graphql';

// tslint:disable-next-line:no-any
type BasicResolver<Result, Args = any> = (
  // tslint:disable-next-line:no-any
  parent: any,
  args: Args,
  // tslint:disable-next-line:no-any
  context: any,
  info: GraphQLResolveInfo
) => Promise<Result> | Result;

type AppResolverResult<R> =
  | Promise<R>
  | Promise<{ [P in keyof R]: () => Promise<R[P]> }>
  | { [P in keyof R]: () => Promise<R[P]> }
  | { [P in keyof R]: () => R[P] }
  | R;

// tslint:disable-next-line:no-any
export type AppResolvedResult<Resolver> = Resolver extends AppResolver<infer Result, any, any, any>
  ? Result
  : never;

export type SubsetResolverWithFields<R, IncludedFields extends string> = R extends BasicResolver<
  Array<infer ResultInArray>,
  infer ArgsInArray
>
  ? BasicResolver<
      Array<Pick<ResultInArray, Extract<keyof ResultInArray, IncludedFields>>>,
      ArgsInArray
    >
  : R extends BasicResolver<infer Result, infer Args>
    ? BasicResolver<Pick<Result, Extract<keyof Result, IncludedFields>>, Args>
    : never;

export type SubsetResolverWithoutFields<R, ExcludedFields extends string> = R extends BasicResolver<
  Array<infer ResultInArray>,
  infer ArgsInArray
>
  ? BasicResolver<
      Array<Pick<ResultInArray, Exclude<keyof ResultInArray, ExcludedFields>>>,
      ArgsInArray
    >
  : R extends BasicResolver<infer Result, infer Args>
    ? BasicResolver<Pick<Result, Exclude<keyof Result, ExcludedFields>>, Args>
    : never;

export type AppResolver<Result, Parent, Args, Context> = (
  parent: Parent,
  args: Args,
  context: Context,
  info: GraphQLResolveInfo
) => AppResolverResult<Result>;

export type AppResolverOf<Resolver, Parent, Context> = Resolver extends BasicResolver<
  infer Result,
  infer Args
>
  ? AppResolver<Result, Parent, Args, Context>
  : never;

export type AppResolverWithFields<
  Resolver,
  Parent,
  Context,
  IncludedFields extends string
> = AppResolverOf<SubsetResolverWithFields<Resolver, IncludedFields>, Parent, Context>;

export type AppResolverWithoutFields<
  Resolver,
  Parent,
  Context,
  ExcludedFields extends string
> = AppResolverOf<SubsetResolverWithoutFields<Resolver, ExcludedFields>, Parent, Context>;
