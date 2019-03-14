const GitLab = require('./gitlab');

const mock_project = {
  id: 1,
  name: 'project1'
};

const mock_merge_requests = [
  {
    id: 1,
    title: 'MR1',
    description: 'MR1 description',
    author: {
      name: 'person'
    },
    web_url: 'https://gitlab.com/merge/1',
    updated_at: 1552548304225 // new Date().valueOf()
  },
  {
    id: 2,
    title: 'MR2',
    description: 'MR2 description',
    author: {
      name: 'person'
    },
    web_url: 'https://gitlab.com/merge/2',
    updated_at: 1552548304225 // new Date().valueOf()
  }
];

test('merge requests are retrieved from multiple page', async () => {
  const gitlab = new GitLab('https://gitlab.com', 'xxx', 'mygroup');
  gitlab._getGroupMergeRequests = jest.fn(({ page }) => {
    return new Promise((resolve, reject) => {
      process.nextTick(() => {
        resolve({
          headers: { 'x-total-pages': 3 },
          body: mock_merge_requests
        });
      });
    });
  });

  const result = await gitlab.getGroupMergeRequests();
  expect(result).toEqual([
    {
      author: { name: 'person' },
      description: 'MR1 description',
      id: 1,
      title: 'MR1',
      updated_at: 1552548304225,
      web_url: 'https://gitlab.com/merge/1'
    },
    {
      author: { name: 'person' },
      description: 'MR2 description',
      id: 2,
      title: 'MR2',
      updated_at: 1552548304225,
      web_url: 'https://gitlab.com/merge/2'
    },
    {
      author: { name: 'person' },
      description: 'MR1 description',
      id: 1,
      title: 'MR1',
      updated_at: 1552548304225,
      web_url: 'https://gitlab.com/merge/1'
    },
    {
      author: { name: 'person' },
      description: 'MR2 description',
      id: 2,
      title: 'MR2',
      updated_at: 1552548304225,
      web_url: 'https://gitlab.com/merge/2'
    },
    {
      author: { name: 'person' },
      description: 'MR1 description',
      id: 1,
      title: 'MR1',
      updated_at: 1552548304225,
      web_url: 'https://gitlab.com/merge/1'
    },
    {
      author: { name: 'person' },
      description: 'MR2 description',
      id: 2,
      title: 'MR2',
      updated_at: 1552548304225,
      web_url: 'https://gitlab.com/merge/2'
    }
  ]);
});

test('No open merge requests work', async () => {
  const gitlab = new GitLab('https://gitlab.com', 'xxx', 'mygroup');
  gitlab._getGroupMergeRequests = jest.fn(({ page }) => {
    return new Promise((resolve, reject) => {
      process.nextTick(() => {
        resolve({
          headers: { 'x-total-pages': 1 },
          body: []
        });
      });
    });
  });

  const result = await gitlab.getGroupMergeRequests();
  expect(result).toEqual([]);
});
