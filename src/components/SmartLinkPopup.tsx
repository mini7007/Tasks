"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/**
 * Small popup that appears on the home page the first time a user visits.
 * Persists a dismissed flag in localStorage so it doesn't show every visit.
 */
export default function SmartLinkPopup() {
  const [open, setOpen] = useState(false);
  const [dontShow, setDontShow] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem("smartlink_popup_dismissed");
      if (!dismissed) {
        // open after a short delay so it doesn't feel abrupt
        const t = window.setTimeout(() => setOpen(true), 700);
        return () => clearTimeout(t);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleClose = (persist = true) => {
    try {
      if (persist) {
        localStorage.setItem("smartlink_popup_dismissed", "1");
      }
    } catch (e) {
      // ignore
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogTrigger asChild>
        {/* hidden trigger — we open programmatically */}
        <span className="sr-only">Open smart link popup</span>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Welcome to iTasks</DialogTitle>
        <DialogDescription>
          Try the quick AI tools on this page (Doc generator, task suggester and
          SEO helper) — they can help you save time. You can always re-open
          this popup later from the home page.
        </DialogDescription>

        <div className="mt-4 text-sm text-muted-foreground">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={dontShow}
              onChange={(e) => setDontShow(e.target.checked)}
              className="accent-primary"
            />
            <span>Do not show this again</span>
          </label>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={() => handleClose(dontShow)}>
            Close
          </Button>
          <a
            href="https://www.effectivegatecpm.com/kecdvpnbj?key=c5287d7a9600c81a39f67d14509287b5"
            target="_blank"
            rel="noreferrer"
            onClick={() => handleClose(dontShow)}
          >
            <Button>Learn more</Button>
          </a>
        </div>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}

