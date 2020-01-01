// rename playlists

playlists.items.forEach(async (list, index) => {
  const payload = {
    method: 'PUT',
    headers,
    body: JSON.stringify({ name: `test${index}` })
  };

  const editList = await fetch(
    `https://api.spotify.com/v1/playlists/${list.id}`,
    payload
  ).then(response => console.log(response));

  console.log(editList);
});
