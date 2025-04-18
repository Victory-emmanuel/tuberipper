
```typescript
import { NextRequest, NextResponse } from 'next/server';
import ytdl from 'ytdl-core';
export async function POST(req: NextRequest) {
  try {
    const { youtubeLink, videoResolution, audioQuality } = await req.json();

    if (!youtubeLink || !videoResolution || !audioQuality) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const videoInfo = await ytdl.getInfo(youtubeLink);

    // Find suitable formats based on requested resolution and quality
    const videoFormat = videoInfo.formats.find(
      (format) => format.hasVideo && format.height === parseInt(videoResolution, 10)
      );

      const audioFormat = videoInfo.formats.find(
        (format) => format.hasAudio && format.audioQuality === audioQuality
        );

      if (!videoFormat || !audioFormat) {
        return NextResponse.json(
          { error: 'Could not find suitable video/audio formats' },
          { status: 400 }
          );
        }

    //  Return the URLs of the best available formats. In a production app, you would likely
    //  want to handle the actual streaming/downloading of these URLs server-side instead of
    //  just returning the YouTube URLs to the client.  This example directly returns the URLs
    //  for simplicity, but be aware of potential issues with YouTube's rate limiting and
    //  URL expiration.
        
        return NextResponse.json({ videoUrl: videoFormat.url, audioUrl: audioFormat.url });
  } catch (error: any) {
      console.error('Error in API route:', error);
      return NextResponse.json({ error: 'Failed to fetch video information' }, { status: 500 });
  }
}
```
