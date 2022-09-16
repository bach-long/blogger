<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'date_birth' => 'datetime:Y-m-d'
    ];

    public function images() {
        return $this->hasMany(Image::class, 'user_id', 'id');
    }
    public function articles()
    {
        return $this->hasMany(Article::class, 'user_id', 'id');
    }

    public function likes()
    {
        return $this->belongsToMany(Article::class, 'likes', 'user_id', 'article_id')->withPivot('value');
    }

    public function bookmark()
    {
        return $this->belongsToMany(Article::class, 'bookmarks', 'user_id', 'article_id');
    }
    public function comments()
    {
        return $this->belongsToMany(Article::class, 'comment', 'user_id', 'article_id')->using(Comment::class)->withPivot('id', 'content', 'parent_id', 'reply_id')->withTimestamps();
    }
    public function view()
    {
        return $this->belongsToMany(Article::class, 'view', 'user_id', 'article_id');
    }
    // users that are followed by this user
    public function following() {
        return $this->belongsToMany(User::class, 'follow', 'follower_id', 'following_id');
    }
    // users that follow this user
    public function followers() {
        return $this->belongsToMany(User::class, 'follow', 'following_id', 'follower_id');
    }
}
