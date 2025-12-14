# [Todo List CI/CD demo][site]

[![Upload status][upload-badge]][upload-flow]
[![Lint status][lint-badge]][lint-flow]

This is a quick todo list demo app to use for the Generation UK&I Azure Course' practical lab on
building a CI/CD pipeline. It stores the entries purely locally, in the browser's `localStorage`.

Since December 2025, it deploys to Github Pages behind a custom domain, rather than the originally
configured Azure deployment, but is still using a Github Actions CI/CD flow.


[site]: https://todo.psquid.net/

[upload-badge]: https://github.com/rjgraffham/todo-list-genuki/actions/workflows/upload.yml/badge.svg
[upload-flow]: https://github.com/rjgraffham/todo-list-genuki/actions/workflows/upload.yml

[lint-badge]: https://github.com/rjgraffham/todo-list-genuki/actions/workflows/lint.yml/badge.svg
[lint-flow]: https://github.com/rjgraffham/todo-list-genuki/actions/workflows/lint.yml