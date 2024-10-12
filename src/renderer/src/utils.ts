function getFileNameWithoutExtension(filePath: string): string {
  // 获取文件名
  const fileName = getFileName(filePath)

  // 查找最后一个点号的位置
  const lastDotIndex = fileName.lastIndexOf('.')

  // 如果没有找到点号，则返回整个文件名
  if (lastDotIndex === -1) {
    return fileName
  }

  // 提取文件名（不包含扩展名）
  return fileName.substring(0, lastDotIndex)
}

function getFileName(filePath: string): string {
  // 查找最后一个斜杠的位置
  const lastSlashIndex = filePath.lastIndexOf('/')
  // 查找最后一个反斜杠的位置
  const lastBackslashIndex = filePath.lastIndexOf('\\')
  // 找到最后一个斜杠或反斜杠的位置
  const lastSeparatorIndex = Math.max(lastSlashIndex, lastBackslashIndex)

  // 如果没有找到斜杠或反斜杠，则文件名就是整个路径
  if (lastSeparatorIndex === -1) {
    return filePath
  }

  // 提取文件名
  return filePath.substring(lastSeparatorIndex + 1)
}

function getDirectory(filePath: string): string {
  // 查找最后一个斜杠的位置
  const lastSlashIndex = filePath.lastIndexOf('/')
  // 查找最后一个反斜杠的位置
  const lastBackslashIndex = filePath.lastIndexOf('\\')
  // 找到最后一个斜杠或反斜杠的位置
  const lastSeparatorIndex = Math.max(lastSlashIndex, lastBackslashIndex)

  // 如果没有找到斜杠或反斜杠，则返回空字符串
  if (lastSeparatorIndex === -1) {
    return ''
  }

  // 提取目录部分
  return filePath.substring(0, lastSeparatorIndex)
}