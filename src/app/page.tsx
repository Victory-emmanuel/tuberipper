"use client";

import ytdl from 'ytdl-core';
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Icons } from "@/components/icons";

const resolutions = ["360p", "480p", "720p", "1080p"];
const audioQualities = ["128kbps", "192kbps", "256kbps", "320kbps"];

export default function Home() {
  const [youtubeLink, setYoutubeLink] = useState("");
  const [videoResolution, setVideoResolution] = useState("720p");
  const [audioQuality, setAudioQuality] = useState("192kbps");
  const [downloadLinks, setDownloadLinks] = useState<{ mp4: string | null; mp3: string | null }>({ mp4: null, mp3: null });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateLinks = async () => {
    setIsLoading(true);
    setError(null);
    setDownloadLinks({ mp4: null, mp3: null });

    // Basic validation - improve with regex
      if (!youtubeLink.includes("youtube.com") && !youtubeLink.includes("youtu.be")) {
        setError("Please enter a valid YouTube link.");
        setIsLoading(false);
        return;
      }

      try {
        // Simulate processing time
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Validate YouTube URL
        if (!ytdl.validateURL(youtubeLink)) {
          setError("Invalid YouTube URL");
          setIsLoading(false);
          return;
        }

        // Get video info
        const info = await ytdl.getInfo(youtubeLink);
        const videoTitle = info.videoDetails.title;

        // Generate MP4 link
        const format = ytdl.chooseFormat(info.formats, { quality: videoResolution, filter: 'videoandaudio' });
        const mp4Link = format ? format.url : null;
        if(!mp4Link){
          setError("no mp4 link avaliable with the resolution selected");
          setIsLoading(false);
          return;
        }

        // Generate MP3 link (best audio format)
        const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
        const mp3Link = audioFormat ? audioFormat.url : null;

        setDownloadLinks({ mp4: mp4Link, mp3: mp3Link });
      } catch (err: any) {
        setError("Failed to generate download links. Please try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
  };

  const DownloadLink = ({ href, format, quality }: { href: string | null, format: string, quality: string }) => {
    if (!href) return null;

    return (
      <div className="space-y-2">
        <p className="font-semibold">{format.toUpperCase()} Download Link:</p>
        <a
          href={href}
          className="text-blue-500 hover:underline"
          download={`${format}_${quality}`} // Use the download attribute to trigger download
        >
          Download {format.toUpperCase()} ({quality})
        </a>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4">
      <Card className="w-full max-w-md space-y-4 rounded-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">TubeRipper</CardTitle>
          <CardDescription>Enter YouTube link to generate download links.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="url"
              placeholder="YouTube Video Link"
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Select onValueChange={setVideoResolution} defaultValue={videoResolution}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Video Resolution" />
                </SelectTrigger>
                <SelectContent>
                  {resolutions.map((res) => (
                    <SelectItem key={res} value={res}>
                      {res}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select onValueChange={setAudioQuality} defaultValue={audioQuality}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Audio Quality" />
                </SelectTrigger>
                <SelectContent>
                  {audioQualities.map((quality) => (
                    <SelectItem key={quality} value={quality}>
                      {quality}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleGenerateLinks} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Links...
              </>
            ) : (
              "Generate Download Links"
            )}
          </Button>
          {error && (
            <Alert variant="destructive">
              <Icons.close className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <DownloadLink href={downloadLinks.mp4} format="mp4" quality={videoResolution} />
          <DownloadLink href={downloadLinks.mp3} format="mp3" quality={audioQuality} />
        </CardContent>
      </Card>
    </div>
  );
}
