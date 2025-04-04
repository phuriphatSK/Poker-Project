import { Description } from "../../../Room/types/issues.interface";

export const convertJiraDescriptionToHTML = (description: Description) => {
  return description.content
    .map((group) => {
      if (group.type === "paragraph") {
        return `<div>${group.content
          .map((content) => {
            let text = content.text;
            if (content.type === "text") text = `<span>${text}</span>`;
            if (content.type === "strong") text = `<strong>${text}</strong>`;
            if (content.type === "em") text = `<em>${text}</em>`;
            if (content.type === "underline") text = `<u>${text}</u>`;
            if (content.type === "strike") text = `<s>${text}</s>`;
            if (content.type === "hardBreak") text = `<br />`;
            if (content.type === "emoji")
              text = `<p>${content.attrs?.text}</p>`;
            if (content.type === "inlineCard")
              text = `<a href="${content.attrs?.url}">${content.attrs?.url}</a>`;
            // Apply text formatting (bold, italic, underline, etc.)

            return text;
          })
          .join("")}</div>`;
      }

      if (group.type === "hardBreak") {
        return "<br />";
      }

      if (group.type === "heading") {
        return `<h${group.attrs?.level}>${group.content
          .map((content) => content.text)
          .join("")}</h${group.attrs?.level}>`;
      }

      if (group.type === "bulletList") {
        return `<ul>${group.content
          .map((listItem) => {
            return `<li>${listItem.content[0].content
              .map((content) => content.text)
              .join("")}</li>`;
          })
          .join("")}</ul>`;
      }

      if (group.type === "orderedList") {
        return `<ol>${group.content
          .map((listItem) => {
            return `<li>${listItem.content[0].content
              .map((content) => content.text)
              .join("")}</li>`;
          })
          .join("")}</ol>`;
      }

      if (group.type === "codeBlock") {
        return `<pre><code>${group.content.map((code) => code.text).join("\n")}</code></pre>`;
      }

      return "";
    })
    .join("");
};
