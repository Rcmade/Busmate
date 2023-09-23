class DataModify {
  removeBackSlashN(string) {
    const removeBackSlash = string.replaceAll('\\n', '\n');
    return removeBackSlash;
  }
}

export default new DataModify();
