const { withGradleProperties } = require("expo/config-plugins");

module.exports = (config) =>
  withGradleProperties(config, (cfg) => {
    const set = (key, value) => {
      cfg.modResults = cfg.modResults.filter((p) => p.key !== key);
      cfg.modResults.push({ type: "property", key, value });
    };
    set("org.gradle.jvmargs", "-Xmx2g -XX:MaxMetaspaceSize=512m");
    set("org.gradle.parallel", "false");
    return cfg;
  });
