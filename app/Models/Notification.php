<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class Notification extends Pivot
{
    use HasFactory;
    
    public $incrementing = true;
    
    protected $fillable = [
        'sender_id',
        'receiver_id',
        'type',
    ];

    public function sender() {
        return $this->belongsTo(User::class, 'sender_id', 'id');
    }
}
