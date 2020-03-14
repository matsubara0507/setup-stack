# setup-stack

<p align="left">
  <a href="https://github.com/matsubara0507/setup-stack"><img alt="GitHub Actions status" src="https://github.com/matsubara0507/setup-stack/workflows/Sample/badge.svg"></a>
</p>

This action sets up a [Haskell Stack](https://www.haskellstack.org) for use in actions.

## Usage

See [action.yml](action.yml)

``` yaml
jobs:
  build:
    name: Build ${{ matrix.os }} Sample
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, windows-latest]
    steps:
      - uses: actions/checkout@master
      - name: Setup Haskell Stack
        uses: matsubara0507/setup-stack@master
        with:
          stack-version: 2.1.3 # default is latest version
      - run: |
          stack --version
          stack build
```

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE).
