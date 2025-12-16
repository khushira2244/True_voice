import OpenAI from "openai";
import {config} from "./env.js";

export const openai = new OpenAI({
    apiKey:config.OPENAI_API_KEY,
})

export const OPENAI_MODEL = config.OPENAI_MODEL;
export const OPENAI_API_STYLE = config.OPENAI_API_STYLE;