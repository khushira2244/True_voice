import {fal} from "@fal-ai/client";
import {config} from "./env.js";


fal.config({
    credentials:config.FAL_KEY,
})


export {fal}
