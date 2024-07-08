import * as path from 'path'
import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as http from '@actions/http-client';

interface GhRelease {
    tag_name: string
}

/**
 * Setup Bundletool
 * @param version default: latest
 */
async function setupBundletool(version: string) {
    if (!version || version == 'latest') {
        version = await findLatestVersion()
        core.info(`Find latest version: ${version}`)
    }
    let url = `https://github.com/google/bundletool/releases/download/${version}/bundletool-all-${version}.jar`
    let bundletoolPath = await tc.downloadTool(url)
    core.info(`bundletool path: ${bundletoolPath}`)
    let fileName = path.basename(bundletoolPath)
    await tc.cacheFile(bundletoolPath, fileName, 'bundletool', version)
}

/**
 * Find latest version name
 */
async function findLatestVersion() {
    const url = 'https://api.github.com/repos/google/bundletool/releases/latest'
    let _http = new http.HttpClient();
    let resp = await _http.getJson<GhRelease>(url)
    let version = resp.result?.tag_name;
    if (!version) throw new Error('Not found latest version')
    return version
}

async function run() {
    const version = core.getInput('version');
    await setupBundletool(version)
}

run().catch(e => {
    core.setFailed(`Action failed with error: ${e}`);
})