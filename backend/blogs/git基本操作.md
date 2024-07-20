# git服务器

## 查看文件

服务器创建裸仓库后无法直接查看上传的文件，需要克隆一个工作仓库才能查看文件

```bash
git clone 裸仓库地址
```

## 同步文件

当有新的git时，工作仓库不会同步更新，需要在工作仓库中使用指令同步裸仓库文件

1. **获取裸库的更新：** 首先，进入工作库所在的目录，在工作库中执行以下命令来获取裸库的更新内容：

   ```bash
   git fetch origin
   ```

​       这会从远程裸库（通常被称为 origin）中获取最新的提交，但不会自动合并或应用这些提交到你的当前分支。

2. **合并更新到当前分支：** 一旦获取了裸库的更新内容，你可以选择将这些更新合并到你的当前分支中。你可以使用 `git merge` 命令或 `git rebase` 命令来实现。下面是合并更新的两种方法：

- 使用 `git merge` 命令：

  ```bash
  git merge origin/master
  ```

  这会从远程裸库的 `master` 分支中合并更新到你的当前分支。

- 使用 `git rebase` 命令：

  ```bash
  git rebase origin/master
  ```

  这会从远程裸库的 `master` 分支中获取更新，并将你的当前分支重新应用在更新后的提交上。





## git重复输入密码

**生成或查看 SSH 密钥对**

如果你已经有一个 SSH 密钥对，通常会在 `~/.ssh` 目录下。查看现有的公钥：

```bash
cat ~/.ssh/id_rsa.pub
```

如果没有，你可以生成一个新的密钥对：

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

生成密钥对时会提示输入文件路径，默认路径通常为 `~/.ssh/id_rsa` 和 `~/.ssh/id_rsa.pub`。

**将公钥添加到服务器**

将公钥复制到服务器上的 `authorized_keys` 文件中。假设你的用户名是 `username`，服务器 IP 是 `server_ip`：

```bash
ssh-copy-id username@server_ip
```

或者手动复制：

```bash
cat ~/.ssh/id_rsa.pub | ssh username@server_ip 'cat >> ~/.ssh/authorized_keys'
```

**测试 SSH 连接**

测试 SSH 连接是否成功：

```bash
ssh username@server_ip
```

如果可以无密码登录，则配置正确。

### 配置 Git 仓库 URL

确保 Git 仓库使用 SSH URL 而不是 HTTPS URL。可以通过以下命令查看和修改：

查看远程仓库 URL：

```bash
git remote -v
```

修改为 SSH URL：

```bash
git remote set-url origin git@server_ip:/path/to/repo.git
```

例如，如果你使用的是 GitHub：

```bash
git remote set-url origin git@github.com:username/repo.git
```

完成这些步骤后，你应该能够无密码进行 `git push` 和 `git pull` 操作。





## 本地仓库文件被删除

1. **使用 Git 命令恢复文件**: 如果你还没有将删除操作提交到本地仓库，可以使用以下命令恢复文件：

   ```bash
   git restore <file-path>
   ```

   或者使用老版本的命令：

   ```bash
   git checkout -- <file-path>
   ```

   如果你想恢复所有未跟踪的文件，可以使用：

   ```bash
   git restore .
   ```

   或者：

   ```bash
   git checkout -- .
   ```

2. **检查 Git 状态**: 使用 `git status` 命令来查看哪些文件被删除了。这个命令会列出所有未暂存的更改，包括被删除的文件。

   ```bash
   git status
   ```

3. **从暂存区恢复**: 如果你已经将删除操作暂存了（使用了 `git add`），但是还没有提交，可以通过以下命令取消暂存：

   ```bash
   git reset HEAD <file-path>
   ```

4. **使用 Git Reflog 恢复**: 如果文件已经被提交删除，或者你丢失了工作目录中的文件，`git reflog` 可以显示你的仓库的所有操作记录，包括删除操作。

   ```bash
   git reflog
   ```

   找到删除文件之前的操作，然后根据需要重置你的仓库：

   ```bash
   git reset --hard HEAD@{index}
   ```

   其中 `index` 是你从 `git reflog` 中找到的操作的索引。

5. **从远程仓库克隆**: 如果本地仓库已经丢失了文件，但是远程仓库（如 GitHub）上还有，你可以通过克隆远程仓库来恢复：

   ```bash
   git clone <repository-url>
   ```



6. 若要彻底删除本地仓库文件则在删除本地仓库文件后执行

   ```bash
   git add -A
   ```

   再执行

   ```bash
   git commit -m "msg"
   ```

   此时本地仓库的文件被彻底删除，若再执行push，远程仓库文件将同步被删除





## 自动化部署git

假设你的裸仓库路径是 `/srv/git/repo.git`，你的工作目录是 `/srv/www/yourapp`，你可以按以下步骤进行操作：

1. **更改工作目录所有者和权限**：

   ```bash
   sudo chown -R git:git /srv/www/yourapp
   sudo chmod -R 775 /srv/www/yourapp
   ```

2. **确保裸仓库具有足够的权限**：

   ```bash
   sudo chmod -R 775 /srv/git/repo.git
   ```

3. **设置 `post-receive` 钩子脚本**：

   ```bash
   vi /srv/git/repo.git/hooks/post-receive
   ```

   在 `vi` 编辑器中输入以下内容：

   ```bash
   GIT_WORK_TREE=/srv/www/yourapp git checkout -f
   ```

   保存并退出 `vi`（按 `Esc`，然后输入 `:wq` 并按 `Enter`）。

4. **使钩子可执行**：

   ```bash
   chmod +x /srv/git/repo.git/hooks/post-receive
   ```

### 再次推送更改

在本地仓库中提交并推送更改：

```bash
git add .
git commit -m "Commit message"
git push origin master
```

通过这些步骤，你可以确保工作目录具有足够的权限，以便 Git 能够成功创建和修改文件。如果你仍然遇到权限问题，可以尝试在钩子脚本中添加调试信息，帮助你进一步诊断问题。例如：

```bash
echo "Starting deploy..." >> /srv/www/yourapp/deploy.log
whoami >> /srv/www/yourapp/deploy.log
GIT_WORK_TREE=/srv/www/yourapp git checkout -f >> /srv/www/yourapp/deploy.log 2>&1
echo "Deploy finished." >> /srv/www/yourapp/deploy.log
```

这样你可以查看 `deploy.log` 文件中的输出，以确定脚本的执行情况和用户权限。