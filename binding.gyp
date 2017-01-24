{
  "targets": [
    {
      "target_name": "file",
      "sources": [
        "./src/file.cc"
      ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")"
      ]
    }
  ]
}
