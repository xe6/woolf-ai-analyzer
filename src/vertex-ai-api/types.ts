export type FilePart = {
  fileData: {
    fileUri: string;
    mimeType: string;
  };
};

export type TextPart = {
  text: string;
};

export type Part = FilePart | TextPart;

export type VertexAIRequest = {
  contents: [
    {
      role: 'user';
      parts: Part[];
    },
  ];
};
