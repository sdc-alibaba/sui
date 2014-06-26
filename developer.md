# 一，仓库和分支

## 仓库和分支说明

三个仓库分别是 **sui,wqui,qnui**。其中 **wqui** 和 **qnui** 都是从 **sui** 复制来的，可以理解为 **fork** ，因为在github上无法在同一个organization中fork，所以我们用复制。

每个仓库中的主分支都是dev。
build分支包含所有编译出来的代码，用来在官网服务器上部署。

## 设置remote
假设把三个仓库都clone到本地之后分别是**~/sui**,**~/qnui**,和**~/wqui**。
下一步就是要设置remote，每个仓库中现在都有一个默认的remote叫 **origin** ，指向github上的同名仓库，这个不要修改。

### 设置sui的remote

进入sui仓库，执行 `git remote -v` 会发现已经存在一个 **origin**，那么我们还需要添加一个 **gitlab** 来发布代码。
执行命令 **git remote add  gitlab git@gitlab.alibaba-inc.com:sj/dpl.git** 即可

### 设置qnui的remote

进入qnui仓库，执行 `git remote -v` 会发现也已经存在一个origin，然后和sui中的一样 我们也需要添加gitlab用来发布代码。

* 执行命令 `git remote add  gitlab git@gitlab.alibaba-inc.com:sj/qnui.git`。
* 为了能同步sui上的更新，我们还需要把sui也加入自己的remote：
* 执行命令 `git remote add  sui git@github.com:sdc-alibaba/sui.git`。

这样如果我们 `git fetch sui` 就可以把sui仓库的分支全部更新到qnui中。

**全部的remote关系如下图所示**

![img](http://gtms03.alicdn.com/tps/i3/T17_q9FrFdXXX6cUbS-830-646.png)

# 二，开发流程

假设A开发一个组件ac。

1. A从dev新建一个分支ac，并开发代码, `git checkout -b ac`。
2. A提交代码并push到github，然后在github上向dev发pull request，指定给另一个人B。
3. B review之后同意merge，此时ac分支上的代码就进入了sui的dev分支。

下一步是要把ac组件同步到qnui和wqui。

1. 切换到本地的qnui仓库，切换到dev分支，然后`git fetch sui`，此时会看到一个sui/dev的更新
2. 然后git merge sui/dev，如果有冲突可能要手动解决下
3. 解决完冲突并提交之后，执行 git push origin dev就可以了。

wqui的操作和上面一样。

经过上面的操作，三个仓库中的dev分支中都包含了ac组件。

# 三，发布流程
发布包含两部分，一是把代码发布到CDN上，二是更新官网。

## 发布代码到CDN
1. 以sui为例，切换到分支daily/1.0.0，如果没有就从dev上新建一个。
2. 然后merge dev分支
3. 删除上次发布的tag，`git push gitlab :publish/1.0.0`
4. `git push gitlab daily/1.0.0`，发布到daily环境
5. 本地重新打一个tag，并push
    - `git tag -d publish/1.0.0`
    - `git tag publish/1.0.0`
    - `git push gitlab publish/1.0.0`

## 更新官网

因为官网服务器没有安装node，所以需要我们本地构建好代码

1. 切换到build分支，`git checkout build`
2. `git merge dev`
3. 执行 `grunt`
4. 提交并push。
     * `git commit -a`
     * `git push origin build`
     
官网服务器会定时检查每个仓库的更新（5分钟），所以push完build分之后五分钟内官网就会自动更新。
