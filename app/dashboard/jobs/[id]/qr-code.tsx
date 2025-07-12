"use client";

import QRCode from "qrcode.react";
import { useEffect, useState } from "react";

export function QRCode({ value }: { value: string }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  return <QRCode value={url} />;
}
