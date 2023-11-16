package helpers

import (
	"bufio"
	"encoding/json"
	"os"
	"social-network/pkg"
)

func ReadPostsFromFile(filePath string) ([]pkg.Post, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var posts []pkg.Post
	err = json.NewDecoder(file).Decode(&posts)
	if err != nil {
		return nil, err
	}
	return posts, nil
}

func WritePostsToFile(posts []pkg.Post, filePath string) error {
	file, err := os.Create(filePath)
	if err != nil {
		return err
	}
	defer file.Close()

	// Create a buffered writer for improved performance
	bufferedWriter := bufio.NewWriter(file)
	defer bufferedWriter.Flush()

	// Use json.NewEncoder with the buffered writer
	encoder := json.NewEncoder(bufferedWriter)
	encoder.SetIndent("", "  ") // Optionally set indentation for readability

	// Encode and write the posts
	err = encoder.Encode(posts)
	if err != nil {
		return err
	}

	return nil
}
