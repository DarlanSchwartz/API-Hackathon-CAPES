import { RequestHandler } from "express";
import { z } from "zod";
export type ValidTypes = "string" | "number" | "boolean";
export type QuerySchema = {
    [key: string]: ValidTypes;
};
export type ParamSchema = {
    [key: string]: ValidTypes;
};
export type ExtendedHandler = RequestHandler & {
    bodySchema?: z.Schema | null;
    paramsSchema?: ParamSchema | null;
    querySchema?: QuerySchema | null;
};