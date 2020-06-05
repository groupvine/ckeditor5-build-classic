# GroupVine Custom Build

## Initial Fork & Build

For custom build instructions, see:

https://ckeditor.com/docs/ckeditor5/latest/builds/guides/development/custom-builds.html

Also, for some CSS tweaks (to save an external editor-styles.css
file), see the "Extracting CSS" section here:

https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/advanced-setup.html

## Bringing Up-to-date

For bringing up to date with latest master, see:

https://philna.sh/blog/2018/08/21/git-commands-to-keep-a-fork-up-to-date/

Commit and push any local changes, then:

```
git fetch upstream
git checkout master
git merge upstream/master
git status
```

Manually edit to resolve conflicts (editing not really needed in build area), then for each of these files:

```
git add <filename>
```

Then reinstall & build

```
rm -rf node_modules
npm install
npm run build
```

Also, check whether ckEditorContentStyling() styles need updating (in
gv-types/style.ts, and
[here](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/content-styles.html)

