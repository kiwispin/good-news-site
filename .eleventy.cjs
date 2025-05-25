// .eleventy.cjs
const slugify = require("@sindresorhus/slugify");

module.exports = function(eleventyConfig) {
  // Copy any static assets you add under src/assets/
  eleventyConfig.addPassthroughCopy("src/assets");

  // Slug filter for category URLs
  eleventyConfig.addFilter("slug", (str) => slugify(str));

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "dist"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
