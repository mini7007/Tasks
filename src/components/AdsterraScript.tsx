"use client";
import { useEffect } from "react";

export default function AdsterraScript() {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "//pl28144710.effectivegatecpm.com/2e/33/75/2e33752de0185df92de1873c4a9eee19.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script); // cleanup
        };
    }, []);

    return null;
}
