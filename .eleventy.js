module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  return {
    htmlTemplateEngine: "liquid"
  };
};