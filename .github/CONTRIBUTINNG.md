# Contribute

This article explains how to contribute to project. Please read through the following guidelines.

Write something nice and instructive as an intro. Talk about what kind of contributions you are interested in.

> Welcome! We love receiving contributions from our community, so thanks for stopping by! There are many ways to contribute, including submitting bug reports, improving documentation, submitting feature requests, reviewing new submissions, or contributing code that can be incorporated into the project.

## Summary

> [!Note]
> Before participating in our community, please read our [code of conduct][coc].
> By interacting with this repository, organization, or community you agree to abide by its terms.

This document describes our development process. Following these guidelines shows that you respect the time and effort of the developers managing this project. In return, you will be shown respect in addressing your issue, reviewing your changes, and incorporating your contributions.

## Contributions

There’s several ways to contribute, not just by writing code. If you have questions, see [support][support].

### Financial support

It’s possible to support us financially by becoming a backer or sponsor through [Open Collective][collective].

### Improve docs

As a user you’re perfect for helping us improve our docs.Typo corrections, error fixes, better explanations, new examples, etcetera.

### Improve issues

Some issues lack information, aren’t reproducible, or are just incorrect. You can help by trying to make them easier to resolve.
Existing issues might benefit from your unique experience or opinions.

### Write code

Code contributions are very welcome.
It’s probably a good idea to first post a question or open an issue to report a bug or suggest a new feature before creating a pull request.

## Submitting an issue

- The issue tracker is for issues. Use discussions for support
- Search the issue tracker (including closed issues) before opening a new issue
- Ensure you’re using the latest version of our packages
- Use a clear and descriptive title
- Include as much information as possible: steps to reproduce the issue, error message, version, operating system, etcetera
- The more time you put into an issue, the better we will be able to help you
- The best issue report is a proper reproduction step to prove it

## Development Process

What is your development process?

> [!Tip]
> This project follows the basic git glow

Check and follow [README][readme] file and run on your local.

Talk about branches people should work on. Specifically, where is the starting point? `main`, `feature`, `hotfix` `task` etc.

### Testing

If you add code you need to add tests! We’ve learned the hard way that code without tests is undependable. If your pull request reduces our test coverage because it lacks tests then it will be rejected.

Provide instructions for adding new tests. Provide instructions for running tests.

```sh
npm run test
```

### Style Guidelines

run below command

```sh
npm run lint
```

### Code Formatting

use code formatter in your IDE, add prettier and some other useful extension in your IDE.

### Git Commit Guidelines

below are the guidelines for your commit messages.

- add clear message and with 50 lines
- prefix feature / issue number from issue page

### Submitting a pull request

- Run `npm test` locally to build, format, and test your changes
- Non-trivial changes are often best discussed in an issue first, to prevent you from doing unnecessary work
- For ambitious tasks, you should try to get your work in front of the community for feedback as soon as possible
- New features should be accompanied by tests and documentation
- Don’t include unrelated changes
- Test before submitting code by running `npm test`
- Write a convincing description of why we should land your pull request: it’s your job to convince us

## Pull Request Process

Add notes for pushing your branch:

When you are ready to generate a pull request, either for preliminary review, or for consideration of merging into the project you must first push your local topic branch back up to GitHub:

```sh
git push origin feature/branch-name
```

Include a note about submitting the PR:

Once you've committed and pushed all of your changes to GitHub, go to the page for your fork on GitHub, select your development branch, and click the pull request button. If you need to make any adjustments to your pull request, just push the updates to your branch. Your pull request will automatically track the changes on your development branch and update.

1. Ensure any install or build dependencies are removed before the end of the layer when doing a build.
2. Update the README.md with details of changes to the interface, this includes new environment variables, exposed ports, useful file locations and container parameters.
3. Increase the version numbers in any examples files and the README.md to the new version that this Pull Request would represent. The versioning scheme we use is [SemVer](http://semver.org/).
4. You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

### Review Process

Who reviews it? Who needs to sign off before it’s accepted? When should a contributor expect to hear from you? How can contributors get commit access, if at all?

- The core team looks at Pull Requests on a regular basis in a weekly triage meeting that we hold in a public domain. The is announced in the weekly status updates.
- Our Reviewer will provide constructive Feedback by writing Review Comments (RC). Pull Requester have to address all RC on time.
- After feedback has been given we expect responses within two weeks. After two weeks we may close the pull request if it isn't showing any activity.
- Except for critical, urgent or very small fixes, we try to leave pull requests open for most of the day or overnight if something comes in late in the day, so that multiple people have the chance to review/comment. Anyone who reviews a pull request should leave a note to let others know that someone has looked at it. For larger commits, we like to have a +1 from someone else on the core team and/or from other contributor(s). Please note if you reviewed the code or tested locally -- a +1 by itself will typically be interpreted as your thinking its a good idea, but not having reviewed in detail.

Perhaps also provide the steps your team will use for checking a PR. Or discuss the steps run on your CI server if you have one. This will help developers understand how to investigate any failures or test the process on their own.

### Addressing Feedback

Once a PR has been submitted, your changes will be reviewed and constructive feedback may be provided. Feedback isn't meant as an attack, but to help make sure the highest-quality code makes it into our project. Changes will be approved once required feedback has been addressed.

If a maintainer asks you to "rebase" your PR, they're saying that a lot of code has changed, and that you need to update your fork so it's easier to merge.

To update your forked repository, follow these steps:

### Fetch upstream master and merge with your repo's main branch

```sh
git fetch upstream
git checkout main
git merge upstream/main
```

#### If there were any new commits, rebase your development branch

```sh
git checkout feature/branch-name
git rebase main
```

If too much code has changed for git to automatically apply your branches changes to the new master, you will need to manually resolve the merge conflicts yourself.

Once your new branch has no conflicts and works correctly, you can override your old branch using this command:

```sh
git push origin feature/branch-name
```

Note that this will overwrite the old branch on the server, so make sure you are happy with your changes first!

## Community

Do you have a mailing list, Google group, slack channel, IRC channel? Link to them here.

Include Other Notes on how people can contribute

- You can help us answer questions our users have here:
- You can help build and design our website here:
- You can help write blog posts about the project by:
- You can help with newsletters and internal communications by:

- Create an example of the project in real world by building something or showing what others have built.
- Write about other people’s projects based on this project. Show how it’s used in daily life. Take screenshots and make videos!

## Resources

- [How to contribute to open source](https://opensource.guide/how-to-contribute/)
- [Making your first contribution](https://medium.com/@vadimdemedes/making-your-first-contribution-de6576ddb190)
- [Using pull requests](https://help.github.com/articles/about-pull-requests/)
- [GitHub help](https://help.github.com)
- [git commit message](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)

## License

MIT

## Author

© [Keshav Mohta][author]

<!-- Definitions -->

[author]: https://xkeshav.com
[collective]: https://opencollective.com/xkeshav
[readme]: https://github.com/xkeshav/color-collector/blob/main/README.md
[support]: https://github.com/xkeshav/color-collector/blob/main/.github/SUPPORT.md
[coc]: https://github.com/xkeshav/color-collector/blob/main/.github/CODE_OF_CONDUCT.md
