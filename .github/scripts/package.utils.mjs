const images = {
  api: `${process.env.BASE_IMAGE_NAME}-api`,
  app: `${process.env.BASE_IMAGE_NAME}-app`,
  sync: `${process.env.BASE_IMAGE_NAME}-sync`,
};

/**
 * Attempts to parse the latest version from the published packages that a new `dev` version should be based on.
 * The returned version is resolved as following:
 * - If the first matching version is a full release, that version is returned (e.g. `1.5.0`).
 * - If the first matching version is a dev release, that version is returned (e.g. `1.6.0-dev12`).
 * - Release candidates (e.g. `1.6.0-rc2`) are simply ignored.
 *
 * @returns {Promise<object|null>} The latest dev version, or `null`.
 */
export const findBaseVersionForDev = () =>
  findLatestVersionByPredicate((version) => version.preRelease === null || version.preRelease.tag === "dev");

/**
 * Attempts to parse the latest dev version from the published packages.
 * @returns {Promise<object|null>} The latest dev version, or `null`.
 */
export const findLatestDevVersion = () => findLatestVersionByPredicate((version) => version.preRelease.tag === "dev");

/**
 * Attempts to parse the latest release candidate version from the published packages.
 * @returns {Promise<object|null>} The latest rc version, or `null`.
 */
export const findLatestRcVersion = () => findLatestVersionByPredicate((version) => version.preRelease.tag === "rc");

/**
 * Attempts to parse the latest hotfix version from the published packages.
 * @returns {Promise<object|null>} The latest hotfix version, or `null`.
 */
export const findLatestHotfixVersion = () =>
  findLatestVersionByPredicate((version) => version.preRelease.tag === "hotfix");

/**
 * Attempts to parse the latest release version from the published packages.
 * @returns {Promise<object|null>} The latest release version, or `null`.
 */
export const findLatestReleaseVersion = () =>
  findLatestVersionByPredicate((version) => version.preRelease.tag === null);

const CACHED_VERSIONS = [];
let FIRST_UNCACHED_VERSION_PAGE = 0;

export const findLatestVersionByPredicate = async (test) => {
  for (const version of CACHED_VERSIONS) {
    if (test(version)) {
      return version;
    }
  }
  if (FIRST_UNCACHED_VERSION_PAGE === -1) {
    return null;
  }

  const { parseVersion } = await import("./version.utils.mjs");

  const { owner, name } = getImageInfo(images.api);

  let page = FIRST_UNCACHED_VERSION_PAGE;
  while (true) {
    const data = await fetchPackagePage(owner, name, page);
    if (data.length === 0) {
      FIRST_UNCACHED_VERSION_PAGE = -1;
      return null;
    }
    let matchedVersion = null;
    for (const entry of data) {
      const { tags } = entry.metadata.container;
      for (const tag of tags) {
        const version = parseVersion(tag);
        if (version !== null) {
          CACHED_VERSIONS.push(version);
          if (matchedVersion === null && test(version)) {
            matchedVersion = version;
          }
        }
      }
    }
    page += 1;
    FIRST_UNCACHED_VERSION_PAGE = page;
    if (matchedVersion !== null) {
      return matchedVersion;
    }
  }
};

const getImageInfo = (url) => {
  const [host, owner, name] = url.split("/");
  return { host, owner, name };
};

const fetchPackagePage = async (owner, name, page) => {
  const { getOctokit } = await import("./octokit.mjs");
  const octokit = await getOctokit();
  try {
    // TODO change this to getAllPackageVersionsForPackageOwnedByOrg
    const response = await octokit.rest.packages.getAllPackageVersionsForPackageOwnedByUser({
      package_type: "container",
      package_name: name,
      // TODO change this to `org: name`
      username: owner,
      page,
      per_page: 100,
    });
    return response.data;
  } catch (e) {
    if (e.status === 404) {
      return [];
    }
    throw e;
  }
};
