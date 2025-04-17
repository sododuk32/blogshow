## deployments

github action -> ecs deployments

1. github action ( build image )
2. upload to ecr storage
3. runs on ecs service then make ecs tesk for image
4. build image && upload ec2 container
5. combine with gartget group
6. make (api/giveKey) http contact and generate keyValue for hantoo server connect

## styles

using vailla extract style folder struct

src/styles
=> ul/components/[name].css.ts : component style
=> styles/recipes : style props for each component area
=> styles/theme : seperate layout setting
=> styles/globals.css : web app global setting
