// .eleventy.js
const slugify = require("@sindresorhus/slugify");

module.exports = function(eleventyConfig) {
  // Copy any static assets under src/assets/
  eleventyConfig.addPassthroughCopy("src/assets");

  // Slug helper for categories
  eleventyConfig.addFilter("slug", str => slugify(str));

  return {
    dir: {
      input:    "src",
      includes: "_includes",
      output:   "dist"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine:     "njk"
  };
};
