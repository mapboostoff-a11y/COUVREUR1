
export interface GitHubConfig {
  owner: string;
  repo: string;
  path: string;
  token: string;
}

export const getFileSha = async (config: GitHubConfig): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.path}`,
      {
        headers: {
          Authorization: `Bearer ${config.token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`GitHub API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.sha;
  } catch (error) {
    console.error('Error fetching file SHA:', error);
    throw error;
  }
};

export const updateFile = async (
  config: GitHubConfig,
  content: string,
  sha: string | null,
  message: string
): Promise<void> => {
  try {
    // Convert content to Base64 (handling UTF-8)
    const base64Content = btoa(unescape(encodeURIComponent(content)));

    const body: any = {
      message,
      content: base64Content,
    };

    if (sha) {
      body.sha = sha;
    }

    const response = await fetch(
      `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.path}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${config.token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `GitHub API Error: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error updating file:', error);
    throw error;
  }
};
