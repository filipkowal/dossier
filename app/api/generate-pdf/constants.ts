export const ml = 50;
export const mt = 71;
export const headingSize = 14;
export const textSize = 12;
export const lineHeight = 23;
export const headingLineHeight = 30;
export const convertOptions = {
  wordwrap: null,
  preserveNewlines: false,
  selectors: [
    {
      selector: "p",
      format: "block",
      options: {
        leadingLineBreaks: 1,
        trailingLineBreaks: 1,
      },
    },
    {
      selector: "ul",
      format: "unorderedList",
      options: {
        itemPrefix: "• ",
        leadingLineBreaks: 1,
        trailingLineBreaks: 1,
      },
    },
    {
      selector: "ol",
      format: "orderedList",
      options: {
        leadingLineBreaks: 1,
        trailingLineBreaks: 1,
      },
    },
  ],
};
export const maxChars = 75;
export const secondColumnX = ml + 130;
