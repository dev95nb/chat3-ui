export enum FileType {
    IMAGE = "image",
    DOCUMENT = "document",
    TEXT = "text",
    ARCHIVE = "archive",
    AUDIO = "audio",
    VIDEO = "video",
    UNKNOWN = "unknown"
  }
  
  export function getFileTypeFromUrl(url: string): FileType {
    const extension = url.split(".").pop()?.toLowerCase();
    
    switch (extension) {
      // Images
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "webp":
      case "svg":
      case "bmp":
      case "ico":
        return FileType.IMAGE;
  
      // Documents
      case "pdf":
      case "doc":
      case "docx":
      case "xls":
      case "xlsx":
      case "ppt":
      case "pptx":
        return FileType.DOCUMENT;
  
      // Text files
      case "txt":
      case "html":
      case "htm":
      case "css":
      case "js":
      case "json":
      case "xml":
        return FileType.TEXT;
  
      // Archives
      case "zip":
      case "rar":
      case "7z":
      case "tar":
      case "gz":
        return FileType.ARCHIVE;
  
      // Audio
      case "mp3":
      case "wav":
      case "ogg":
      case "m4a":
        return FileType.AUDIO;
  
      // Video
      case "mp4":
      case "avi":
      case "mov":
      case "wmv":
      case "flv":
      case "webm":
        return FileType.VIDEO;
  
      // Default fallback
      default:
        return FileType.UNKNOWN;
    }
  }
  