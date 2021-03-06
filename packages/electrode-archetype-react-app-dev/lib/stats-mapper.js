"use strict";

const _ = require("lodash");

function extractBundles(stats) {
  // Stats has modules, single bundle
  if (stats.modules) return [stats];

  // Stats has children, multiple bundles
  if (stats.children && stats.children.length) return stats.children;

  // Not sure, assume single
  return [stats];
}

function getBundles(statsResult) {
  const mapModules = mod => {
    if (mod.modules) {
      return mod.modules.map(mapModules);
    }
    const identifier = mod.identifier;
    const mark = identifier.lastIndexOf("!/");
    if (mark > 0) {
      return identifier.substr(mark + 1);
    }
    return identifier;
  };
  // For multi-compiler, stats will be an object with a 'children' array of stats
  const bundles = extractBundles(statsResult.toJson({ errorDetails: false }));
  return bundles.map(stats => {
    const modules = _.flatMap(stats.modules.map(mapModules));
    return {
      name: stats.name,
      time: stats.time,
      hash: stats.hash,
      warnings: stats.warnings || [],
      errors: stats.errors || [],
      modules
    };
  });
}

module.exports = {
  getBundles
};
