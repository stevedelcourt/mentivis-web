import { useLang } from "./messages";
import fr from "../content/videos/videos-fr.json";
import en from "../content/videos/videos-en.json";

export interface Video {
  filepath?: string;
  poster?: string;
  youtube?: string;
  title: string;
  description: string;
}

export interface VideosData {
  videos: Video[];
}

const allVideos: Record<string, VideosData> = { fr, en };

export function getVideos(lang: string): VideosData {
  return allVideos[lang] || allVideos.fr;
}

export function useVideos(): { data: VideosData; lang: string } {
  const lang = useLang();
  return { data: getVideos(lang), lang };
}
