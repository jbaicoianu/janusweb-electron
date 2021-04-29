const ACL_STRINGS = [
  'S-1-15-3-1024-2302894289-466761758-1166120688-1039016420-2430351297-4240214049-4028510897-3317428798:(OI)(CI)(RX)',
  'S-1-15-3-1024-3424233489-972189580-2057154623-747635277-1604371224-316187997-3786583170-1043257646:(OI)(CI)(RX)',
];

module.exports.initACLs = function() {
  return new Promise(resolve => {
    // On Windows, we need to make sure some ACLs are set on our working directory so our appcontainer can access OpenXR
    if (process.platform == 'win32') {
      // Check working directory's existing ACLs against our list of ACL strings
      child_process.exec('icacls .', null, (err, output) => {
        let existing_acls = output.toString();
        let missing_acls = ACL_STRINGS.filter(acl => existing_acls.indexOf(acl) == -1);
        if (missing_acls.length > 0) {
          // ACLs not found, set them now
          let cmd = 'icacls .';
          missing_acls.forEach(acl => cmd += ` /grant *${acl}`);
          child_process.exec(cmd, null, resolve);
        } else {
          // ACLs already set, continue
          resolve();
        }
      });
    } else {
      // Not on Windows, nothing to do!
      resolve();
    }
  });
}


