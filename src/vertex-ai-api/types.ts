export type InlineDataPart = {
  inlineData: {
    mimeType: 'image/jpeg' | 'image/png'; // only images are supported inline
    data: string; // >> Base64 encoded
  };
};

export type TextPart = {
  text: string;
};

export type Part = InlineDataPart | TextPart;

export type VertexAIContent = {
  role: 'user';
  parts: Part[];
};

export type VertexAIRequest = {
  contents: VertexAIContent[];
};

export type CvJobMatchAnalysisResult = {
  analysis: string;
  percentMatch?: number;
};
