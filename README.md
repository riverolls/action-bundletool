<div align="center">
  📦 :octocat:
</div>
<h1 align="center">
  action android bundletool
</h1>

<p align="center">
   A GitHub Action for setup Android Bundletool on Linux, Windows, and macOS virtual environments
</p>

## Usage

```yaml
- name: Setup Bundletool latest
  id: bundletool
  uses: riverolls/action-bundletool@v1
- name: Use jar path
  run: java -jar ${{steps.bundletool.outputs.jar_path}} version
```

### inputs

| Name      | Type     | Required | Default  | Description                                          |
|-----------|----------|:--------:|:---------|------------------------------------------------------|
| `version` | `String` |    ❌     | `latest` | The bundletool version to install. Such as: `1.17.0` |

### outputs

| Name       | Type     | Description                 |
|------------|----------|-----------------------------|
| `jar_path` | `String` | Path to Bundletool jar file |
