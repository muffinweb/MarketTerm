```
1. Install Docker
```

``` 
2. Run Command Below in Terminal
```

To Start CLI APP

```php 
docker-compose up -d && docker attach marketterm_marketterm_1
```

To Reinstall all containers and hard reset

``` terminal
docker stop $(docker ps -a -q) && docker rm $(docker ps -a -q) && docker rmi $(docker images -a -q) && docker volume rm $(docker volume ls -q) &&  docker-compose up -d && docker attach marketterm_marketterm_1
```