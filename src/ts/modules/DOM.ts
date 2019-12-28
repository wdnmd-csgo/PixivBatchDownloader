// DOM 操作类
// 提供公用的 DOM 操作方法，以及从 DOM 中获取数据的 API
class DOM {
  // 获取指定元素里，可见的结果
  static getVisibleEl(selector: string) {
    const list: NodeListOf<HTMLElement> = document.querySelectorAll(selector)
    return Array.from(list).filter(el => {
      return el.style.display !== 'none'
    })
  }

  // 删除 DOM 元素
  static removeEl(el: NodeListOf<Element> | HTMLElement) {
    if (Reflect.has(el, 'length')) {
      // 如果有 length 属性则循环删除。
      ;(el as NodeListOf<Element>).forEach(el => {
        if (el.parentNode) {
          el.parentNode.removeChild(el)
        }
      })
    } else {
      // 没有 length 属性的直接删除（querySelector 的返回值是 HTMLElement）
      const parent = (el as HTMLElement).parentNode
      if (parent) {
        parent.removeChild(el as HTMLElement)
      }
    }
  }

  // 切换 DOM 元素的可见性
  static toggleEl(el: HTMLElement) {
    el.style.display = el.style.display === 'block' ? 'none' : 'block'
  }

  // 将元素插入到页面顶部
  /*
  newindex-inner 是在未登录时的用户作品列表页面使用的
  layout-body 是在未登录时的搜索页使用的
  */
  static insertToHead(el: Element) {
    if (document.body) {
      document.body.insertAdjacentElement('afterbegin', el)
    } else {
      ;(
        document.querySelector('header')! ||
        document.querySelector('.newindex-inner')! ||
        document.querySelector('.layout-body')!
      ).insertAdjacentElement('beforebegin', el)
    }
  }

  // 获取用户 id
  static getUserId() {
    // 首先尝试从 url 中获取
    const test = /(\?|&)id=(\d{1,9})/.exec(window.location.search)
    if (test && test.length > 1) {
      return test[2]
    }

    // 从 head 里匹配
    let test2 = document.head.innerHTML.match(/"userId":"(\d{1,9})"/)
    if (!test2) {
      test2 = document.head.innerHTML.match(
        /authorId&quot;:&quot;(\d{1,9})&quot/
      )
    }
    if (test2 && test2.length > 1) {
      return test2[1]
    }

    // 从 body 里匹配
    let test3 = /member\.php\?id=(\d{1,9})/.exec(document.body.innerHTML)
    if (test3) {
      return test3[1]
    }

    // 从旧版页面的头像获取（主要是在旧版书签页面使用）
    const nameElement = document.querySelector(
      '.user-name'
    )! as HTMLAnchorElement
    if (nameElement) {
      return /\?id=(\d{1,9})/.exec(nameElement.href)![1]
    }

    // 如果都没有获取到
    throw new Error('getUserId failed!')
  }
}

export { DOM }