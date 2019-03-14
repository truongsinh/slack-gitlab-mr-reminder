var request = require('request-promise-native');

class GitLab {
  constructor(external_url, access_token, group) {
    this.external_url = external_url;
    this.access_token = access_token;
    this.group = group;
  }

  _getGroupMergeRequests({ page = 1 }) {
    const options = {
      uri: `${this.external_url}/api/v4/groups/${
        this.group
      }/merge_requests?state=opened&page=${page}`,
      headers: {
        'PRIVATE-TOKEN': this.access_token
      },
      json: true,
      resolveWithFullResponse: true
    };
    return request(options);
  }

  async getGroupMergeRequests() {
    try {
      let promises = [];
      const resp = await this._getGroupMergeRequests({ page : 1 });
      const firstPage = resp.body;
      const totalPages = Number(resp.headers['x-total-pages']);
      for (let pageNumber = 2; pageNumber <= totalPages; pageNumber++) {
        promises.push(this._getGroupMergeRequests({ page: pageNumber }));
      }
      let merge_requests = firstPage.concat(
        ...(await Promise.all(promises)).map(r => r.body)
      );
      return merge_requests;
    } catch (e) {
      throw e;
    }
  }
}

module.exports = GitLab;
