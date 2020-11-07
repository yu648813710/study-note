# wsl 系统修改 bash 显示 git 分支名称

## 问题描述

- 需要再 wsl 的命令行展示 git 分支名称

## 修改步骤

- `cd ~`

- `vim .bashrc`

- 替换以下内容

  ```sh
  if [ "$color_prompt" = yes ]; then
      PS1='${debian_chroot:+($debian_chroot)}\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ '
  else
      PS1='${debian_chroot:+($debian_chroot)}\u@\h:\w\$ '
  fi
  ```

  替换为

  ```sh
    # Add git branch if its present to PS1

    parse_git_branch() {
    git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/(\1)/'
    }
    if [ "$color_prompt" = yes ]; then
    PS1='${debian_chroot:+($debian_chroot)}\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[01;31m\]$(parse_git_branch)\[\033[00m\]\$ '
    else
    PS1='${debian_chroot:+($debian_chroot)}\u@\h:\w$(parse_git_branch)\$ '
    fi

  ```

  结束于

  ```sh
    unset color_prompt force_color_prompt
  ```
