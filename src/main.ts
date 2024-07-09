import * as path from 'path'
import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as http from '@actions/http-client';
import * as fs from "fs";

interface GhRelease {
    tag_name: string
}

/**
 * Setup Bundletool
 * @param version default: latest
 */
async function setupBundletool(version: string) {
    if (version == 'latest' || !version) {
        version = await findLatestVersion()
        core.debug(`Find latest version: ${version}`)
    }
    core.info(`setup version: ${version}`)
    let url = `https://github.com/google/bundletool/releases/download/${version}/bundletool-all-${version}.jar`
    let teamPath = await tc.downloadTool(url)
    core.debug(`bundletool temp path: ${teamPath}`)
    let fileName = path.basename(url)
    core.debug(`fileName: ${fileName}`)
    let bundletoolDir = await tc.cacheFile(teamPath, fileName, 'bundletool', version, 'any')
    let jarPath = path.join(bundletoolDir, fileName)
    core.debug(`bundletool path: ${bundletoolDir}`)
    core.setOutput('jar_path', jarPath)
}

/**
 * Find latest version name
 */
async function findLatestVersion() {
    const url = 'https://api.github.com/repos/google/bundletool/releases/latest'
    let _http = new http.HttpClient('action-bundletool');
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