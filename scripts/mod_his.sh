#!/bin/sh

git filter-branch -f --env-filter '

an="$GIT_AUTHOR_NAME"
am="$GIT_AUTHOR_EMAIL"
cn="$GIT_COMMITTER_NAME"
cm="$GIT_COMMITTER_EMAIL"

if [ "$GIT_COMMITTER_EMAIL" = "lihongxun945@163.com" ]
then
    cn="hongxun.lhx"
    cm="hongxun.lhx@alibaba-inc.com"
fi
if [ "$GIT_AUTHOR_EMAIL" = "lihongxun945@163.com" ]
then
    an="hongxun.lhx"
    am="hongxun.lhx@alibaba-inc.com"
fi

if [ "$GIT_COMMITTER_EMAIL" = "itaofe@gmail.com" ]
then
    cn="半边"
    cm="zangtao.zt@alibaba-inc.com"
fi
if [ "$GIT_AUTHOR_EMAIL" = "itaofe@gmail.com" ]
then
    an="半边"
    am="zangtao.zt@alibaba-inc.com"
fi
if [ "$GIT_COMMITTER_EMAIL" = "yiye.js@gmail.com" ]
then
    cn="何道"
    cm="shuangling.ysl@alibaba-inc.com"
fi
if [ "$GIT_AUTHOR_EMAIL" = "yiye.js@gmail.com" ]
then
    an="何道"
    am="shuangling.ysl@alibaba-inc.com"
fi

export GIT_AUTHOR_NAME="$an"
export GIT_AUTHOR_EMAIL="$am"
export GIT_COMMITTER_NAME="$cn"
export GIT_COMMITTER_EMAIL="$cm"
'
